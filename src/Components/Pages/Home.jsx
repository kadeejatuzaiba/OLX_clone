import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import Login from '../Modal/Login'
import Sell from '../Modal/Sell'
import Card from '../Card/Card'

import { ItemsContext } from '../Context/Item'
import { fetchFromFireStore } from '../Firebase/Firebase'

function Home() {

  const itemCtx = ItemsContext()  // ✅ move up

  const [allItems, setAllItems] = useState([]);
  const [openModal, setModal] = useState(false)
  const [openModalSell, setModalSell] = useState(false)

  const toggleModal = () => setModal(!openModal)
  const toggleModalSell = () => setModalSell(!openModalSell)

  
  useEffect(() => {
    const getItems = async () => {
      const datas = await fetchFromFireStore();
       const sorted = datas.sort((a, b) => b.createdAt - a.createdAt);
      itemCtx?.setItems(sorted);
  setAllItems(sorted);
    };
    getItems();
  }, []);

  useEffect(() => {
    console.log("Updated Items:", itemCtx?.items)
  }, [itemCtx?.items])

  return (
    <div>

      <Navbar
        toggleModal={toggleModal}
        toggleModalSell={toggleModalSell}
        allItems={allItems}
      />

      <Login toggleModal={toggleModal} status={openModal} />

      <Sell toggleModalSell={toggleModalSell} status={openModalSell} />

      <Card items={itemCtx?.items || []} />

    </div>
  )
}

export default Home