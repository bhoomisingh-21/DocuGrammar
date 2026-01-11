const Row = ({ label, value }) => (
  <div className="flex justify-between text-xs md:text-sm">
    <span className="text-gray-200">{label}</span>
    <span className="text-gray-100 font-medium">{value}</span>
  </div>
);

export default Row;
