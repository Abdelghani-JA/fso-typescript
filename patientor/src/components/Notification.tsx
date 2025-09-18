export const Notification = ({
  notification,
  setNotification,
}: {
  notification: {
    type: string;
    message: string;
  };
  setNotification: React.Dispatch<
    React.SetStateAction<{
      type: string;
      message: string;
    }>
  >;
}) => {
  const color = notification.type === "error" ? "red" : "yellowgreen";
  const style = {
    border: `2px solid ${color}`,
  };

  setTimeout(() => {
    setNotification({ type: "", message: "" });
  }, 3000);

  return <p style={style}>{notification.message}</p>;
};
