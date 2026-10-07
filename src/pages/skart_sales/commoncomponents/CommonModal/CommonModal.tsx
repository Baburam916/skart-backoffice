import { Dialog } from "../../../../base-components/Headless";
function CommonModal(data: any) {
  const { open, setOpen, title, description, footer, size, gridColumns } = data;
  return (
    <>
      <style>{`
        .BModalgif {
          position: absolute;
          top: -30px;
          left: -30px;
          border-radius: 120px;
          z-index: 0;
        }

        .BModalgif img {
          transform: scale(-1);
          max-width: 492px;
          border-radius: 0 0 90px 0;
        }

        .BModalgif::before {
          position: absolute;
          content: "f";
          width: 200px;
          height: 200px;
          background: #f6c153;
          top: 0;
          right: -110px;
          z-index: 1;
          filter: blur(32px);
        }
      `}</style>

      <Dialog
        // staticBackdrop
        open={open}
        onClose={() => {
          // setOpen(false);
        }}
        size={size}
      >
        <Dialog.Panel className="px-0 py-0 mt-3 rounded-[15px] border-[1px] border-[#fff0db]">
          <Dialog.Title className=" px-2 py-2 lg:px-3 lg:py-2 border-b border-slate-200/60 dark:border-darkmode-400  bg-mustard rounded-t-[14px] relative overflow-hidden">
            <div className="w-full">
              <div className="ModalbackTittle relative z-[1] w-full ">
                {title}
              </div>
              <div className="BModalgif">
                {" "}
                <img src="https://skartnew-prod.s3.ap-southeast-1.amazonaws.com/others/additional_bg.gif" />{" "}
              </div>
            </div>
          </Dialog.Title>
          <Dialog.Description
            // className={`grid grid-cols-${gridColumns}  gap-4 gap-y-3`}
            className={` gap-4 gap-y-3`}
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
