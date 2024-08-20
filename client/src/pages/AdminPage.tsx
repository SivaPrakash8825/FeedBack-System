import { Link } from "react-router-dom";
import Icon1 from "/icon1.svg";
import Icon2 from "/icon2.svg";
import Icon3 from "/icon3.svg";
import Icon4 from "/icon4.svg";
import { ReactNode } from "react";
import { FaChartColumn } from "react-icons/fa6";
import { TbTrashXFilled } from "react-icons/tb";
import { BsDatabaseFillUp } from "react-icons/bs";
import { IoDocumentLock } from "react-icons/io5";
import useDepartment from "../store/useDepartment";

const AdminPage = () => {
  const { dept } = useDepartment();
  return (
    <section className=" mx-auto flex min-h-[calc(100vh-6rem)] items-center justify-center gap-0 bg-cover ">
      <div className="flex items-center justify-center gap-10">
        <Card
          icon={<FaChartColumn className="text-5xl text-white" />}
          title="Generate Report"
          link="/admin/reportgenerate"
        />
        <Card
          icon={<IoDocumentLock className="text-5xl text-white" />}
          title="Generate Login"
          link="/admin/generate"
        />
        {dept.length > 1 && (
          <>
            <Card
              icon={<BsDatabaseFillUp className="text-5xl text-white" />}
              title="Update Data"
              link="/admin/update"
            />
            <Card
              icon={<TbTrashXFilled className="text-5xl text-white" />}
              title="Delete Data"
              link="/admin/delete"
            />
          </>
        )}
      </div>
    </section>
  );
};

export default AdminPage;

const Card = ({
  icon,
  title,
  link,
}: {
  icon: ReactNode;
  title: string;
  link: string;
}) => (
  <Link to={link} className="group">
    <div
      className={`flex flex-col items-center justify-around gap-3  rounded-md  bg-primary p-6  py-10 text-white shadow-box-sm transition-all  duration-300 ease-in-out hover:-translate-y-6 hover:shadow-box active:scale-95 active:duration-150 `}
    >
      {icon}
      <h2 className="text-wrap text-center text-2xl font-semibold">{title}</h2>
    </div>
  </Link>
);
