import PopupWithForm from "./PopupWithForm";
export default function CardDeleter({
  isOpen,
  onClose,
  onConfirmDelete,
  isLoading,
}) {
  function handleSubmit(e) {
    e.preventDefault();
    onConfirmDelete();
  }

  return (
    <PopupWithForm
      name="cardDelete"
      heading="Are you sure?"
      submitText="Yes"
      loadingText="Deleting..."
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      isValid={true}
    />
  );
}
