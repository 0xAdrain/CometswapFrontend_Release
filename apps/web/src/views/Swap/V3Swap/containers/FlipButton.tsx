import { AutoColumn, Button } from '@cometswap/uikit'
import { Swap as SwapUI } from '@cometswap/widgets-internal'

import { useCallback, memo } from 'react'
import replaceBrowserHistoryMultiple from '@cometswap/utils/replaceBrowserHistoryMultiple'
import { useTranslation } from '@cometswap/localization'

import { useExpertMode } from '@cometswap/utils/user'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import { useSwapState } from 'state/swap/hooks'
import { Field } from 'state/swap/actions'
import { AutoRow } from 'components/Layout/Row'

import { useAllowRecipient } from '../hooks'

export const FlipButton = memo(function FlipButton() {
  const { t } = useTranslation()
  const [isExpertMode] = useExpertMode()
  const { onSwitchTokens, onChangeRecipient } = useSwapActionHandlers()
  const {
    recipient,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const allowRecipient = useAllowRecipient()

  const onFlip = useCallback(() => {
    onSwitchTokens()
    replaceBrowserHistoryMultiple({
      inputCurrency: outputCurrencyId,
      outputCurrency: inputCurrencyId,
    })
  }, [onSwitchTokens, inputCurrencyId, outputCurrencyId])

  return (
    <AutoColumn justify="space-between">
      <AutoRow justify={isExpertMode ? 'space-between' : 'center'} style={{ padding: '0 1rem', marginTop: '1em' }}>
        <SwapUI.SwitchButton onClick={onFlip} />
        {allowRecipient && recipient === null ? (
          <Button
            variant="text"
            id="add-recipient-button"
            onClick={() => onChangeRecipient('')}
            data-dd-action-name="Swap flip button"
          >
            {t('+ Add a send (optional)')}
          </Button>
        ) : null}
      </AutoRow>
    </AutoColumn>
  )
})

