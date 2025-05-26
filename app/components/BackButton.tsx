import { useNavigate } from "react-router";
import { FaArrowLeftLong } from "react-icons/fa6";
export function BackButton() {
  const navigate = useNavigate();
  return (
    <button onClick={(e) => navigate(-1)} className="lg:invisible btn btn-sm btn-ghost">
      <FaArrowLeftLong className="text-xl text-base-content" />
    </button>
  );
}
