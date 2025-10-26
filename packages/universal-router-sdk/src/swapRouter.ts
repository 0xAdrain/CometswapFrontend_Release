import { TradeType } from '@cometswap/sdk'
import { SmartRouter, SmartRouterTrade } from '@cometswap/smart-router'
import { MethodParameters } from '@cometswap/v3-sdk'
import invariant from 'tiny-invariant'
import { encodeFunctionData, toHex } from 'viem'
import { UniversalRouterABI } from './abis/UniversalRouter'
import { CometSwapTrade } from './entities/protocols/cometswap'
import { CometSwapOptions, SwapRouterConfig } from './entities/types'
import { encodePermit } from './utils/inputTokens'
import { RoutePlanner } from './utils/routerCommands'

export abstract class CometSwapUniversalRouter {
  /**
   * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
   * @param trades to produce call parameters for
   * @param options options for the call parameters
   */
  public static swapERC20CallParameters(
    trade: Omit<SmartRouterTrade<TradeType>, 'gasEstimate'>,
    options: CometSwapOptions,
  ): MethodParameters {
    // TODO: use permit if signature included in swapOptions
    const planner = new RoutePlanner()

    const tradeCommand: CometSwapTrade = new CometSwapTrade(trade, options)

    const inputCurrency = tradeCommand.trade.inputAmount.currency
    invariant(!(inputCurrency.isNative && !!options.inputTokenPermit), 'NATIVE_INPUT_PERMIT')

    if (options.inputTokenPermit && typeof options.inputTokenPermit === 'object') {
      encodePermit(planner, options.inputTokenPermit)
    }

    const nativeCurrencyValue = inputCurrency.isNative
      ? SmartRouter.maximumAmountIn(tradeCommand.trade, options.slippageTolerance, tradeCommand.trade.inputAmount)
          .quotient
      : 0n

    tradeCommand.encode(planner)
    return CometSwapUniversalRouter.encodePlan(planner, nativeCurrencyValue, {
      deadline: options.deadlineOrPreviousBlockhash
        ? BigInt(options.deadlineOrPreviousBlockhash.toString())
        : undefined,
    })
  }

  /**
   * Encodes a planned route into a method name and parameters for the Router contract.
   * @param planner the planned route
   * @param nativeCurrencyValue the native currency value of the planned route
   * @param config the router config
   */
  private static encodePlan(
    planner: RoutePlanner,
    nativeCurrencyValue: bigint,
    config: SwapRouterConfig = {},
  ): MethodParameters {
    const { commands, inputs } = planner
    const calldata = config.deadline
      ? encodeFunctionData({
          abi: UniversalRouterABI,
          args: [commands, inputs, BigInt(config.deadline)],
          functionName: 'execute',
        })
      : encodeFunctionData({ abi: UniversalRouterABI, args: [commands, inputs], functionName: 'execute' })
    return { calldata, value: toHex(nativeCurrencyValue) }
  }
}
