import { useEffect } from 'react'
import { useModal } from '@cometswap/uikit'
import { useTranslation } from '@cometswap/localization'
import { useUserNotUsCitizenAcknowledgement, IdType } from 'hooks/useUserIsUsCitizenAcknowledgement'
import USCitizenConfirmModal from 'components/Modal/USCitizenConfirmModal'
import Hero from './components/Hero'
import IfoProvider from './contexts/IfoContext'

export const IfoPageLayout = ({ children }) => {
  const { t } = useTranslation()

  const [userNotUsCitizenAcknowledgement] = useUserNotUsCitizenAcknowledgement(IdType.IFO)
  const [onUSCitizenModalPresent] = useModal(
    <USCitizenConfirmModal
      title={t('CometSwap IFOs')}
      id={IdType.IFO}
      checks={[
        {
          key: 'checkbox',
          content: t('I confirm that I am eligible to participate in IFOs on this platform.'),
        },
      ]}
    />,
    false,
    false,
    'usCitizenConfirmModal',
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!userNotUsCitizenAcknowledgement) {
        onUSCitizenModalPresent()
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [userNotUsCitizenAcknowledgement, onUSCitizenModalPresent])

  return (
    <IfoProvider>
      <Hero />
      {children}
    </IfoProvider>
  )
}

