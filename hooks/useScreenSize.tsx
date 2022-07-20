import React, { useEffect, useState } from 'react'

/**
 * 描述 获取当前屏幕大小
 * @date 2022-07-20
 * @returns {any}
 */
function useScreenSize(): { width: number; height: number } {
  const [screenSize, setScreenSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 })

  useEffect(() => {
    setScreenSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', () => {
      window.requestAnimationFrame(() => {
        setScreenSize({ width: window.innerWidth, height: window.innerHeight })
      })
    })

    return () => {
      window.removeEventListener('resize', () => {
        return
      })
    }
  }, [])

  return screenSize
}

export default useScreenSize