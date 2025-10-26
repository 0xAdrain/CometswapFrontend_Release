import { useTranslation } from '@cometswap/localization'
import { ChainId } from '@cometswap/sdk'
import { Address } from 'viem'

import { StakeButton } from './StakeButton'
import { useICometBridgeStatus } from '../../../hooks/useIfoCredit'
import { useChainNames } from '../../../hooks/useChainNames'
import { BridgeButton } from './BridgeButton'
import { WarningTips, LinkTitle, ContentText } from '../../WarningTips'

type Props = {
  ifoId: string

  ifoChainId: ChainId

  ifoAddress?: Address
}

export function ICometTips({ ifoChainId, ifoId, ifoAddress }: Props) {
  const { t } = useTranslation()
  const { noIComet, hasBridged, shouldBridgeAgain, sourceChainCredit, destChainCredit } = useICometBridgeStatus({
    ifoChainId,
    ifoAddress,
  })
  const chainName = useChainNames([ifoChainId])

  if (hasBridged) {
    return (
      <BridgeButton
        mt="0.625rem"
        ifoChainId={ifoChainId}
        icake={sourceChainCredit}
        dstIcake={destChainCredit}
        buttonVisible={false}
        ifoId={ifoId}
      />
    )
  }

  const tips = noIComet
    ? t('You don’t have any iCOMETavailable for IFO public sale.')
    : shouldBridgeAgain
    ? t('Bridge iCOMETagain if you have extended your COMETstaking or added more COMET')
    : t('Bridge your iCOMETto participate this sale on %chain%', {
        chain: chainName,
      })

  const action = noIComet ? (
    <StakeButton />
  ) : (
    <BridgeButton ifoChainId={ifoChainId} icake={sourceChainCredit} dstIcake={destChainCredit} ifoId={ifoId} />
  )

  return (
    <WarningTips
      mt="1.5rem"
      action={action}
      title={!shouldBridgeAgain && <LinkTitle href="/ifo#ifo-how-to">{t('How to Take Part')} »</LinkTitle>}
      content={<ContentText>{tips}</ContentText>}
    />
  )
}

