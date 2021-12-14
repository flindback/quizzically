import "./style.scss";
const Button = ({
  btnText,
  onClick,
  isPrimary,
  disabled = false,
  id,
  testid,
}) => {
  return (
    <button
      data-testid={testid}
      id={id}
      disabled={disabled}
      onClick={onClick}
      className={`button ${
        isPrimary ? "button--primary" : "button--secondary"
      } ${disabled ? "button--disabled" : ""}`}
    >
      {btnText}
    </button>
  );
};

export default Button;
