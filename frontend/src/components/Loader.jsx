// Beautiful sequencer loader with Arena Agent branding
export default function Loader({ text = "Loading Arena Agent..." }) {
  return (
    <div className="loader-overlay">
      <div className="loader-container">
        <div className="loader-logo">
          <img src="/logo.svg" alt="Arena Agent" />
        </div>
        
        <div className="loader-sequencer">
          <div className="seq-bar"></div>
          <div className="seq-bar"></div>
          <div className="seq-bar"></div>
          <div className="seq-bar"></div>
          <div className="seq-bar"></div>
        </div>
        
        <div className="loader-text">{text}</div>
        
        <div className="loader-brand">
          <span className="brand-arena">ARENA</span>
          <span className="brand-agent">AGENT</span>
        </div>
      </div>
    </div>
  )
}
