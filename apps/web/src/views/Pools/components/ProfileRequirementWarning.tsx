import { Box, Message, MessageText } from '@cometswap/uikit'

import { Pool, NextLinkFromReactRouter } from '@cometswap/widgets-internal'

import { useTranslation } from '@cometswap/localization'
import { Token } from '@cometswap/sdk'
import { useProfileRequirement } from '../hooks/useProfileRequirement'

export function ProfileRequirementWarning({
  profileRequirement,
}: {
  profileRequirement: Pool.DeserializedPool<Token>['profileRequirement']
}) {
  const { t } = useTranslation()
  const { notMeetRequired, notMeetThreshold } = useProfileRequirement(profileRequirement)
  return (
    <Message variant="warning">
      <Box>
        <MessageText>
          {notMeetRequired &&
            notMeetThreshold &&
            t('This pool requires active Comet Profile and %amount% profile points.', {
              amount: profileRequirement?.thresholdPoints?.toNumber(),
            })}
          {notMeetRequired && !notMeetThreshold && t('This pool requires active Comet Profile')}
          {!notMeetRequired &&
            notMeetThreshold &&
            t('This pool requires %amount% profile points.', {
              amount: profileRequirement?.thresholdPoints?.toNumber(),
            })}
        </MessageText>
        {(notMeetRequired || notMeetThreshold) && (
          <MessageText bold>
            {notMeetRequired ? (
              <NextLinkFromReactRouter style={{ textDecoration: 'underline' }} to="/create-profile">
                {t('Create Profile')} »
              </NextLinkFromReactRouter>
            ) : (
              <NextLinkFromReactRouter style={{ textDecoration: 'underline' }} to="/profile">
                {t('Go to Profile')} »
              </NextLinkFromReactRouter>
            )}
          </MessageText>
        )}
      </Box>
    </Message>
  )
}

