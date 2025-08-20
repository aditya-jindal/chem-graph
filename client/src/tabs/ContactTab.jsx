const ContactTab = () => {
  return (
    <div className="bg-white shadow-lg rounded-3xl p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-blue-700 mb-8">Contact Information</h1>
      <p className="text-lg text-gray-700 mb-6">
        For any further information, please contact the authors:
      </p>
      <div className="space-y-10">
  <div className="border-l-4 border-gray-300 pl-6 text-left">
    <p>
      <strong>Mr. Kavin Jacob D</strong><br />
      School of Advanced Sciences, Department of Mathematics,<br />
      Vellore Institute of Technology, Vellore.<br />
      E-mail: <a href="mailto:kavinjacob@gmail.com" className="text-blue-700 hover:underline">kavinjacob@gmail.com</a>
    </p>
  </div>

  <div className="border-l-4 border-gray-300 pl-6 text-left">
    <p>
      <strong>Dr. Clement J</strong><br />
      School of Advanced Sciences, Department of Mathematics,<br />
      Vellore Institute of Technology, Vellore.<br />
      E-mail: <a href="mailto:clementjmail@gmail.com" className="text-blue-700 hover:underline">clementjmail@gmail.com</a>
    </p>
  </div>

  <div className="border-l-4 border-gray-300 pl-6 text-left">
    <p>
      <strong>Dr. M Arockiaraj</strong><br />
      Department of Mathematics,<br />
      Loyola College, Chennai.<br />
      E-mail: <a href="mailto:marockiaraj@gmail.com" className="text-blue-700 hover:underline">marockiaraj@gmail.com</a>
    </p>
  </div>

  <div className="border-l-4 border-gray-300 pl-6 text-left">
    <p>
      <strong>Mr. Aditya Jindal</strong><br />
      School of Computer Science and Engineering,<br />
      Vellore Institute of Technology, Vellore.<br />
      E-mail: <a href="mailto:adityajindal1509@gmail.com" className="text-blue-700 hover:underline">adityajindal1509@gmail.com</a>      
    </p>
  </div>

    <div className="border-l-4 border-gray-300 pl-6 text-left">
    <p>
      <strong>Dr. Krishnan Balasubramanian</strong><br />
      School of Molecular Sciences,<br />
      Arizona State University, USA.<br />
      E-mail: <a href="kbalu@asu.edu" className="text-blue-700 hover:underline">kbalu@asu.edu</a>
    </p>
  </div>
</div>

    </div>
  );
};

export default ContactTab;
