import erc20abi from './erc20abi.json'
import { ethers } from 'ethers';
import { useState } from 'react';



function App() {

   const [contractAddress,setContractAddress] = useState('')
   const [name,setTokenName] = useState({})
   const [balance ,setBalance] = useState({})
   const [toAddress ,setToAddress] = useState('')
   let [amount ,setAmount] = useState('')
   
   
   const openMetamask = async()=>{
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const erc20 = new ethers.Contract(contractAddress,erc20abi,provider)
      setTokenName(
        {
          name: await erc20.name(),
          symbol: await erc20.symbol(),
          totalsupply: (await erc20.totalSupply()).toNumber()
        })
    }
   
    // console.log('contract_address',contractAddress);
    const getBalance = async()=>{
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send('eth_requestAccounts',[]) 
      const erc20 = new ethers.Contract(contractAddress,erc20abi,provider)
      const signer =  provider.getSigner()
      const signerAddress = await signer.getAddress()
      
      const getBalance = await erc20.balanceOf(signerAddress)
      setBalance({
          address: signerAddress,
           balance:getBalance.toNumber()
          })
    }
  
    const transfer = async()=>{
      try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send('eth_requestAccounts',[])
      const Signer = await provider.getSigner()
      const erc20 = new ethers.Contract(contractAddress,erc20abi,Signer)
      // console.log(amount);
      await erc20.transfer(toAddress,amount)
      } catch (error) {
         console.log(error);  
      }
      
    }
        

  
  return (
    <div className="App">
       <input  value={contractAddress} onChange={(e)=>setContractAddress(e.target.value)} />
       <p> name:  {name?.name} , symbol : {name?.symbol} , totalSupply : {name?.totalsupply} </p>
       <button onClick={()=>openMetamask()}> Get Token info</button>
       
       <button onClick={()=>getBalance()}> get my balance </button>
       <p> address : {balance.address} ,Balance: {balance.balance}</p>

       <p> transfer token </p>
       <input value={toAddress} onChange={(e)=>setToAddress(e.target.value)} />
       <input value={amount} onChange={(e)=>setAmount(e.target.value)} />
       <button onClick={()=>transfer()}> transfer</button>
    </div>
  );
}

export default App;
