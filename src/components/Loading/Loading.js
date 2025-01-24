export default function LoadingPage() {
    return <>
    <style jsx>{`
        .loader {
          position: absolute;
          top: 40%;
          left: 50%;
          border: 16px solid #f3f3f3; 
          border-top: 16px solid#000000;
          border-radius: 50%;
          width: 120px;
          height: 120px;
          animation: spin 2s linear infinite;
          margin: auto;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
    `}</style>
    <div className="loader"></div>
  </>
}
