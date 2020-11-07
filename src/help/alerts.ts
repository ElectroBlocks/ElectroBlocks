import swal from "sweetalert";
export const onErrorMessage = (message: string, e) => {
  swal("Opps", message, "error");
  console.error(e);
};

export const onConfirm = async (message: string): Promise<boolean> => {
  try {
    return await swal({
      text: message,
      icon: "info",
      dangerMode: true,
      buttons: [true, true],
    });
  } catch (e) {
    console.error(e);
    return confirm(message);
  }
};

export const onSuccess = (message: string) => {
  swal("Good job!", message, "success");
};
