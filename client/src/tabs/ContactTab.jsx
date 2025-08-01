const ContactTab = () => {
  return (
    <div className="bg-white shadow-lg rounded-3xl p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-blue-700 mb-8">Contact Information</h1>
      <p className="text-lg text-gray-700 mb-6">
        For any further information, please contact the authors:
      </p>
      <div className="space-y-10">
        <div className="border-l-4 border-gray-300 pl-6">
          <p>
            <strong>Dr. Clement J</strong><br />
            Assistant Professor,<br />
            School of Advanced Sciences, Department of Mathematics,<br />
            Vellore Institute of Technology, Vellore.<br />
            E-mail: <a href="mailto:clementjmail@gmail.com" className="text-blue-700 hover:underline">clementjmail@gmail.com</a>
          </p>
        </div>

        <div className="border-l-4 border-gray-300 pl-6">
          <p>
            <strong>Mr. Kavin Jacob D</strong><br />
            Research Scholar,<br />
            School of Advanced Sciences, Department of Mathematics,<br />
            Vellore Institute of Technology, Vellore.<br />
            E-mail: <a href="mailto:kavinjacob@gmail.com" className="text-blue-700 hover:underline">kavinjacob@gmail.com</a>
          </p>
        </div>

        <div className="border-l-4 border-gray-300 pl-6">
          <p>
            <strong>Dr. M Arockiaraj</strong><br />
            Associate Professor,<br />
            Department of Mathematics,<br />
            Loyola College, Chennai.<br />
            E-mail: <a href="mailto:marockiaraj@gmail.com" className="text-blue-700 hover:underline">marockiaraj@gmail.com</a>
          </p>
        </div>

        <div className="border-l-4 border-gray-300 pl-6">
          <p>
            <strong>Mr. Aditya Jindal</strong><br />
            B.TECH, Computer Science<br />
            School of Computer Science and Engineering,<br />
            Vellore Institute of Technology, Vellore.<br />
            E-mail: <a href="mailto:adityajindal1509@gmail.com" className="text-blue-700 hover:underline">adityajindal1509@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactTab;
