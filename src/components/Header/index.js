import "./style.scss";

const Header = ({ showTooltip }) => {
  return (
    <header>
      <h1 className={`header__heading`}>
        <span className={"header__heading__variable-text"}>
          {showTooltip ? "Bas" : "Quizz"}
        </span>
        ically <span className={showTooltip ? "" : "hidden"}>,</span>
      </h1>
      <div className={`tooltip ${showTooltip ? "tooltip--visible" : ""}`}>
        <ol>
          <li>Click the button labeled 'Start!'</li>
          <li>Answer the questions</li>
          <li>
            Ponder on the magnificence of tech and how little (or much) you know
          </li>
        </ol>
      </div>
    </header>
  );
};

export default Header;
