import { Dialog } from "../base-components/Headless";
import Lucide from "../base-components/Lucide";

const TaxModal = ({ open, onClose, children }: any) => {
  return (
    <div>
      <Dialog staticBackdrop open={open} onClose={onClose}>
        {children}
      </Dialog>
    </div>
  );
};

export default TaxModal;

export const MainModal = (data: any) => {
  const {
    open,
    title,
    size,
    overflow = false,
    setOpen,
    description,
    handleCancel,
    footer,
    close = true,
  } = data;
  return (
    <>
      <Dialog
        size={size ? size : null}
        open={open}
        onClose={() => {}}
        className="mt-0"
      >
        <Dialog.Panel className="px-2 py-1">
          {close && (
            <Dialog.Title className="flex justify-between">
              <h2 className="mr-auto text-base font-medium">{title}</h2>
              <Lucide
                icon="XCircle"
                className="w-5 h-5 cursor-pointer hover:text-red-500"
                onClick={() => {
                  setOpen(false);
                  if (handleCancel) handleCancel();
                }}
              />
            </Dialog.Title>
          )}
          <Dialog.Description className={`${overflow ? "overflow-y-auto h-[65vh]" : ""}`}>
            {description}
          </Dialog.Description>
          {close && <Dialog.Footer>{footer}</Dialog.Footer>}
        </Dialog.Panel>
      </Dialog>
    </>
  );
};
