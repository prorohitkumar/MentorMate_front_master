import React from 'react'

export default function HomePage() {
    const cardDetails = [
        {
          imageSrc: '/images/quiz.png',
          title: 'Quick Quiz',
          text: 'Test your knowledge with our quick quiz!',
          link: '/quick-quiz'
        },
        {
          imageSrc: '/images/assessment.png',
          title: 'Assessment Creator',
          text: 'Create Custom Assessments Effortlessly',
          link: '/assessment-creator'
        },
        {
          imageSrc: '/images/casestudy.png',
          title: 'Case Study Creator',
          text: 'Craft Engaging Case Studies',
          link: '/case-study-creator'
        },
        {
          imageSrc: '/images/code.jpg',
          title: 'Code Reviewer',
          text: 'Evaluate Code Effectively',
          link: '/code-reviewer'
        }
      ];

  return (
    <div className="container" style={{marginTop: '150px'}}>
      <div className="row">
        {cardDetails.map((card, index) => (
          <div className="col-lg-3 col-md-6 mb-4" key={index}>
            <div className="card h-100">
              <img src={card.imageSrc} className="card-img-top" alt="Card" style={{height: '200px', objectFit: 'cover'}} />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{card.title}</h5>
                <p className="card-text">{card.text}</p>
                <a href={card.link} className="btn btn-primary mt-auto" style={{backgroundColor: '#2980b9'}}>
                  Start
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
   
    // <div className="container" style={{marginTop: '100px'}} >
    //   <div className="row">
    //     <div className="col-md-6">
    //       <div className="row">
    //         {cardDetails.slice(0, 2).map((card, index) => (
    //           <div className="col-md-6 mb-4" key={index}> {/* Added mb-4 for margin bottom */}
    //             <div className="card">
    //               <img src={card.imageSrc} className="card-img-top" alt="Card" />
    //               <div className="card-body">
    //                 <h5 className="card-title">{card.title}</h5>
    //                 <p className="card-text">{card.text}</p>
    //                 <a href={card.link} className="btn btn-primary">
    //                   Learn more
    //                 </a>
    //               </div>
    //             </div>
    //           </div>
    //         ))}
    //       </div>
    //     </div>
    //     <div className="col-md-6">
    //       <div className="row">
    //         {cardDetails.slice(2, 4).map((card, index) => (
    //           <div className="col-md-6 mb-4" key={index}> {/* Added mb-4 for margin bottom */}
    //             <div className="card">
    //               <img src={card.imageSrc} className="card-img-top" alt="Card" />
    //               <div className="card-body">
    //                 <h5 className="card-title">{card.title}</h5>
    //                 <p className="card-text">{card.text}</p>
    //                 <a href={card.link} className="btn btn-primary">
    //                   Learn more
    //                 </a>
    //               </div>
    //             </div>
    //           </div>
    //         ))}
    //       </div>
    //     </div>
    //   </div>
    // </div>
              
           
  )
}
