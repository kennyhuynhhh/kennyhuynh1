// CameraController.jsx
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'

export default function CameraController() {
  const { camera } = useThree()
  const velocity = useRef({ x: 0, z: 0 })
  const keys = useRef({})

  useEffect(() => {
    const handleKeyDown = (e) => {
      keys.current[e.key.toLowerCase()] = true
    }

    const handleKeyUp = (e) => {
      keys.current[e.key.toLowerCase()] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useFrame(() => {
    const speed = 0.1

    if (keys.current['w']) velocity.current.z = -speed
    else if (keys.current['s']) velocity.current.z = speed
    else velocity.current.z = 0

    if (keys.current['a']) velocity.current.x = -speed
    else if (keys.current['d']) velocity.current.x = speed
    else velocity.current.x = 0

    camera.position.x += velocity.current.x
    camera.position.z += velocity.current.z
  })

  return null
}