// import React, { useEffect, useState } from 'react'
// import Navbar from '../Navbar/Navbar'
// import Login from '../Modal/Login'
// import Sell from '../Modal/Sell'
// import Card from '../Card/Card'

// import { ItemsContext } from '../Context/Item'
// import { fetchFromFireStore } from '../Firebase/Firebase'

// function Home() {
//   const [openModal,setModal]=useState(false)
//   const [openModalSell,setModalSell]=useState(false)
//   const toggleModal=()=>{
//     setModal(!openModal)
//   }

//   const toggleModalSell=()=>{
//     setModalSell(!openModalSell)
//   }
//   const  itemCtx = ItemsContext();

//  useEffect(()=>{
//       const getItems = async () => {
//         const datas = await fetchFromFireStore();
//         itemCtx?.setItems(datas);
//       }
//       getItems();
//     },[])

//    useEffect(()=>{
//   console.log('Updated Items: ', itemCtx?.items);
// },[itemCtx?.items])

//   return (
//     <div>
//       <Navbar toggleModal={toggleModal} toggleModalSell={toggleModalSell}/>
     
//       <Login toggleModal={toggleModal} status={openModal}/>
//       <Sell setItems={(itemCtx).setItems} toggleModalSell={toggleModalSell} status={openModalSell}/>
//       <Card items={(itemCtx).items || []}/>
//     </div>
//   )
// }

// export default Home


import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import Login from '../Modal/Login'
import Sell from '../Modal/Sell'
import Card from '../Card/Card'

import { ItemsContext } from '../Context/Item'
import { fetchFromFireStore } from '../Firebase/Firebase'

function Home() {

  const [openModal, setModal] = useState(false)
  const [openModalSell, setModalSell] = useState(false)

  const toggleModal = () => {
    setModal(!openModal)
  }

  const toggleModalSell = () => {
    setModalSell(!openModalSell)
  }

  const itemCtx = ItemsContext()

  useEffect(() => {

    const getItems = async () => {
      const datas = await fetchFromFireStore()
      itemCtx?.setItems(datas)
    }

    getItems()

  }, [])

  useEffect(() => {
    console.log("Updated Items:", itemCtx?.items)
  }, [itemCtx?.items])

  return (
    <div>

      <Navbar
        toggleModal={toggleModal}
        toggleModalSell={toggleModalSell}
      />

      <Login
        toggleModal={toggleModal}
        status={openModal}
      />

      <Sell
        toggleModalSell={toggleModalSell}
        status={openModalSell}
      />

      <Card
        items={itemCtx?.items || []}
      />

    </div>
  )
}

export default Home