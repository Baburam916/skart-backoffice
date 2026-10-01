import { Dialog } from "../../../../base-components/Headless";
function CommonModal(data: any) {
  const { open, setOpen, title, description, footer, size, gridColumns } = data;
  return (
    <>
      <Dialog
        // staticBackdrop
        open={open}
        onClose={() => {
          // setOpen(false);
        }}
        size={size}
      >
        <Dialog.Panel className="px-2 py-1 mt-3">
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Description
            className={`grid grid-cols-${gridColumns}  gap-4 gap-y-3`}
          >
            {description}
          </Dialog.Description>
          <Dialog.Footer>{footer}</Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}
export default CommonModal;
