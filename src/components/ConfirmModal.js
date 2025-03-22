import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmModal = ({ show, onHide, onConfirm, title, message }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title || 'Onay'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message || 'Bu işlemi gerçekleştirmek istediğinizden emin misiniz?'}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          İptal
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Evet, Onayla
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal; 