const TradingRewardPage = () => <></>

export const getServerSideProps = () => {
  return {
    redirect: {
      destination: '/trading-reward/comet-stakers',
      permanent: true,
    },
  }
}

export default TradingRewardPage

