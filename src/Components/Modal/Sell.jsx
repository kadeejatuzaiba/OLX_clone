


import React, { useState } from "react";
import { Modal, ModalBody } from "flowbite-react";
import Swal from "sweetalert2";

import { addDoc, collection } from "firebase/firestore";
import { fireStore, fetchFromFireStore } from "../Firebase/Firebase";

import { UserAuth } from "../Context/Auth";
import { ItemsContext } from "../Context/Item";

import Input from "../Input/Input";

import fileUpload from "../../assets/fileUpload.svg";
import loading from "../../assets/loading.gif";
import close from "../../assets/close.svg";

const Sell = ({ status, toggleModalSell }) => {

  const itemCtx = ItemsContext();
  const setItems = itemCtx?.setItems;

  const auth = UserAuth();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // ✅ SAME CATEGORY LIST (VERY IMPORTANT)
  const categories = [
    "Cars",
    "Motorcycles",
    "Mobile Phones",
    "Houses & Apartments",
    "Scooters",
    "Commercial Vehicles",
    "For Rent"
  ];

  // image upload
  const handleImageUpload = (event) => {
    if (event.target.files) {
      setImage(event.target.files[0]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!auth?.user) {
      Swal.fire("Login Required", "Please login to continue", "warning");
      return;
    }

    setSubmitting(true);

    const trimmedTitle = title.trim();
    const trimmedPrice = price.toString().trim();
    const trimmedDescription = description.trim();

    // ✅ validation
    if (!trimmedTitle || !category || !trimmedPrice || !trimmedDescription) {
      Swal.fire("Missing Fields", "All fields are required", "info");
      setSubmitting(false);
      return;
    }

    if (!image) {
      Swal.fire("Image Required", "Please upload a product image", "info");
      setSubmitting(false);
      return;
    }

    if (isNaN(trimmedPrice) || Number(trimmedPrice) <= 0) {
      Swal.fire("Invalid Price", "Price must be a valid number", "warning");
      setSubmitting(false);
      return;
    }

    let imageUrl = "";

    // convert image to base64
    try {
      const reader = new FileReader();

      imageUrl = await new Promise((resolve, reject) => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(image);
      });

    } catch (error) {
      Swal.fire("Error", "Image upload failed", "error");
      setSubmitting(false);
      return;
    }

    try {

      await addDoc(collection(fireStore, "Products"), {
        title: trimmedTitle,
        category: category, // ✅ already correct from dropdown
        price: trimmedPrice,
        description: trimmedDescription,
        imageUrl,
        userId: auth.user.uid,
        userName: auth.user.displayName || "Anonymous",
        createdAt: Date.now(), 
      });
const datas = await fetchFromFireStore();

const sorted = [...datas].sort((a, b) => b.createdAt - a.createdAt);

setItems(sorted);
      Swal.fire("Success", "Item added successfully!", "success");

      // reset
      setTitle("");
      setCategory("");
      setPrice("");
      setDescription("");
      setImage(null);

      toggleModalSell();

    } catch (error) {
      Swal.fire("Error", "Failed to add item", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={status} size="md" popup={true} onClose={toggleModalSell}>
      <ModalBody className="bg-white rounded-lg p-6">

        {/* close */}
        <img
          onClick={toggleModalSell}
          className="w-5 absolute right-6 top-6 cursor-pointer"
          src={close}
          alt="close"
        />

        <h2 className="text-xl font-bold mb-4">Post Your Ad</h2>

        <form onSubmit={handleSubmit}>

          <Input setInput={setTitle} placeholder="Title" />

          {/* ✅ CATEGORY DROPDOWN */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 border-2 border-black rounded-md mt-3"
          >
            <option value="">Select Category</option>

            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <Input setInput={setPrice} placeholder="Price" />
          <Input setInput={setDescription} placeholder="Description" />

          {/* Image Upload */}
          <div className="pt-3">
            {image ? (
              <div className="border-2 border-black rounded-md h-40 flex justify-center overflow-hidden">
                <img
                  className="object-contain"
                  src={URL.createObjectURL(image)}
                  alt="preview"
                />
              </div>
            ) : (
              <div className="relative border-2 border-black rounded-md h-40">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center h-full">
                  <img className="w-10" src={fileUpload} alt="upload" />
                  <p className="text-sm pt-2">Click to upload image</p>
                </div>
              </div>
            )}
          </div>

          {/* loading */}
          {submitting ? (
            <div className="flex justify-center pt-4">
              <img className="w-24" src={loading} alt="loading" />
            </div>
          ) : (
            <button
              type="submit"
              className="w-full mt-4 p-3 rounded-lg text-white font-semibold"
              style={{ backgroundColor: "#002f34" }}
            >
              Sell Item
            </button>
          )}

        </form>
      </ModalBody>
    </Modal>
  );
};

export default Sell;