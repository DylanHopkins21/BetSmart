import React, { useState } from "react";
import styles from "./wagerModal.module.css"
import placeholderImage from "./WagerModalPhoto.png";




const Modal = ({ setIsOpen }) => {
    return (
        <>
      <div className={styles.darkBG} onClick={() => setIsOpen(false)} />
      <div className={styles.centered}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h1 className={styles.headingh1}>CS70 Midterm</h1>
            <h3 className={styles.headingh3}>Fall 2024</h3>
          </div>
          <div className={styles.modalimage}>
          
          </div>
          <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
            X
          </button>
          <div className={styles.timeBar}>
            <p>06:48:22</p>
          </div>
          <div className={styles.progressBar}>
              <div></div>
          </div>
          <div className={styles.bottomBar}>
            <div className={styles.wagerAmount}>
              <p>$5</p>
              <span className={styles.label}>Entry</span>
            </div>
            <div className={styles.wagerNumber}>
              <p>20</p>
              <span className={styles.label}>Participants</span>
            </div>
            <div className={styles.wagerPrize}>
              <p>$100</p>
              <span className={styles.label}>Prize</span>
            </div>
            <div className={styles.modalActions}>
              <div className={styles.actionsContainer}>
                <button className={styles.deleteBtn} onClick={() => setIsOpen(false)}>
                  Yes
                </button>
                <button
                className={styles.cancelBtn}
                onClick={() => setIsOpen(false)}
              >
                No
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
    );
  };
  
  export default Modal;

