import { useState } from 'react'
import { Box, Button } from '@0xsequence/design-system'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Box height="full" width="full" background="backgroundPrimary">
      <Button label="Test" onClick={() => {console.log('hello world')}}/>
    </Box>
  )
}

export default App
