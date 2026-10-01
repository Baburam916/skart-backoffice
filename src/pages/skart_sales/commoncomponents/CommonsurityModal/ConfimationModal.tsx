import React from 'react'
import Button from '../../../../base-components/Button';
import CommonModal from '../CommonModal/CommonModal';
import LoadingButtonCommon from '../LoadingButtonCommon/LoadingButtonCommon';

export default function ConfirmationModal({
  valuetopass,
  setValuetopass,
  openModal,
  setOpenModal,
  des,
  footer,
  title,
  funtohit,
  handleCancel,
  modalloading,
  setModalLoading,
}: any) {
  const description = (
    <div className="flex justify-center gap-4 col-span-12">
      <h1>Are you sure you want to perform this action?</h1>
      {/* <Button
          className="px-4 py-1 rounded-lg bg-green-400 text-white hover:bg-green-500 ml-2"
          onClick={() => {
            setConfirmSpinner(true);
            if (confirmData?.forWhat == 1) {
              generateProformaInvoice(confirmData?.job_id);
            } else if (confirmData?.forWhat == 2) {
              generateHouseDraft(confirmData?.job_id);
        
            } else if (confirmData?.forWhat == 4) {
              heldUpEnquiry(
                confirmData?.enquiry_id,
                confirmData?.reason,
                confirmData?.remark
              );
            }
          }}
          disabled={confirmSpinner}
        >
          Yes
          {confirmSpinner && (
            <LoadingIcon
              icon="puff"
              color="white"
              className="w-5 h-5 ml-2 stroke-2.5 text-white"
            />
          )}
        </Button>
        <Button
          className="px-4 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 ml-2"
          onClick={() => setConfirm(false)}
          disabled={confirmSpinner}
        >
          No
        </Button> */}
    </div>
  );
  const ModalTitle = (
    <>
      <h1>Confirmation!!</h1>
    </>
  );
  const Modalfooter = (
    <div className="">
      <div className="min-[534px]:flex justify-end items-end mr-7">
        <div className="flex gap-2 ml-4 max-[528px]:mt-2">
          <Button
            type="button"
            onClick={() => {
              setOpenModal(false);
              setModalLoading(false);
              if (valuetopass) {
                setValuetopass("");
              }
            }}
            className="w-20 text-white mr-1 bg-gray-500 p-2"
          >
            Cancel
          </Button>
          <Button
            variant="mustard"
            disabled={modalloading}
            onClick={() => {
              if (valuetopass) {
                funtohit(valuetopass);
              } else {
                funtohit();
              }
            }}
            className="ml-2 bg-mustard p-2 w-[100px]"
          >
            {modalloading ? <LoadingButtonCommon text="loading" /> : "Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
  return (
    <CommonModal
      open={openModal}
      setOpen={setOpenModal}
      title={title || ModalTitle}
      description={des || description}
      footer={footer || Modalfooter}
      gridColumns={24}
      size={"md"}
    />
  );
}
