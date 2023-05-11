import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/dist/types'
import { INITIAL_SUPPLY, networkConfig } from '../helper-hardhat-config'
import { developmentChains } from '../helper-hardhat-config'
import verify from '../utils/verify'

const deployMyToken: DeployFunction = async function (
   hre: HardhatRuntimeEnvironment
) {
   const { deployments, network, getNamedAccounts } = hre
   const { deploy, log } = deployments
   const { deployer } = await getNamedAccounts()

   const args: any[] = [INITIAL_SUPPLY]

   const myToken = await deploy('MyToken', {
      from: deployer,
      args,
      log: true,
      waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
   })

   log(`MyToken deployed at ${myToken.address}`)

   if (
      !developmentChains.includes(network.name) &&
      process.env.ETHERSCAN_API_KEY
   ) {
      await verify(myToken.address, args)
   }
}

deployMyToken.tags = ['all', 'myToken']
export default deployMyToken
