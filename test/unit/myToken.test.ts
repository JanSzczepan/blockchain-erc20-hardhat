import { deployments, ethers, network } from 'hardhat'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { MyToken } from '../../typechain-types'
import { INITIAL_SUPPLY, developmentChains } from '../../helper-hardhat-config'

developmentChains.includes(network.name) &&
   describe('MyToken unit tests', function () {
      let myToken: MyToken
      let deployer: SignerWithAddress
      let user: SignerWithAddress

      beforeEach(async function () {
         const accounts = await ethers.getSigners()
         deployer = accounts[0]
         user = accounts[1]

         await deployments.fixture(['all'])
         myToken = await ethers.getContract('MyToken', deployer)
      })

      it('should have correct INITIAL_SUPPLY of token', async function () {
         const initialSupply = (await myToken.totalSupply()).toString()
         expect(initialSupply).to.equal(INITIAL_SUPPLY)
      })

      it('should transfer to the deployer INITIAL_SUPPLY', async function () {
         const deployerTokenBalance = (
            await myToken.balanceOf(deployer.address)
         ).toString()
         expect(deployerTokenBalance).to.equal(INITIAL_SUPPLY)
      })

      it('should be able to transfer tokens successfully to an address', async function () {
         const tokensToSend = ethers.utils.parseEther('10')
         await myToken.transfer(user.address, tokensToSend)
         const userTokenBalance = (
            await myToken.balanceOf(user.address)
         ).toString()
         expect(userTokenBalance).to.equal(tokensToSend)
      })

      it('should approve other address to spend token', async function () {
         const tokensToSpend = ethers.utils.parseEther('5')
         await myToken.approve(user.address, tokensToSpend)
         const myTokenConnectedToUser = await ethers.getContract(
            'MyToken',
            user
         )
         await myTokenConnectedToUser.transferFrom(
            deployer.address,
            user.address,
            tokensToSpend
         )
         const userTokenBalance = (
            await myToken.balanceOf(user.address)
         ).toString()
         expect(userTokenBalance).to.equal(tokensToSpend)
      })
   })
