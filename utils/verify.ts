import { run } from 'hardhat'

export default async function verify(
   address: string,
   constructorArguments: any[]
) {
   console.log('Verifying contract...')

   try {
      await run('verify:verify', {
         address,
         constructorArguments,
      })
   } catch (error) {
      if (error.message.toLowerCase().includes('already verified')) {
         console.log('Already verified!')
      } else {
         console.log(error)
      }
   }
}
