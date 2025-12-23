import Snowfall from 'react-snowfall'

export function SnowEffect() {
  return (
    <Snowfall
      snowflakeCount={150}
      style={{
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  )
}