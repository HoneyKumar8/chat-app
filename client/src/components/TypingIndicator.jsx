const TypingIndicator = ({
  typingUser
}) => {

  if (!typingUser) return null;

  return (
    <div
      className="
      text-sm
      text-slate-400
      italic
    "
    >
      {typingUser} is typing...
    </div>
  );
};

export default TypingIndicator;