"use client";
import React, { Fragment } from "react";
import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

const Modal = () => {
  let [isOpen, setIsOpen] = useState(true);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <button onClick={openModal} type="button" className="btn">
        Track
      </button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          open={isOpen}
          as={"div"}
          onClose={closeModal}
          className={"dialog-container"}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              as={Fragment}
            >
              <Dialog.Overlay className={"fixed inset-0"}></Dialog.Overlay>
            </Transition.Child>
          </div>
          {/* <Dialog.Panel>
            <Dialog.Title>Deactivate account</Dialog.Title>
            <DiaFragment
              This will permanently deactivate your account
            </Dialog.Description>

            <p>
              Are you sure you want to deactivate your account? All of your data
              will be permanently removed. This action cannot be undone.
            </p>

            <button onClick={() => setIsOpen(false)}>Deactivate</button>
            <button onClick={() => setIsOpen(false)}>Cancel</button>
          </Dialog.Panel> */}
        </Dialog>
      </Transition>
    </>
  );
};

export default Modal;
