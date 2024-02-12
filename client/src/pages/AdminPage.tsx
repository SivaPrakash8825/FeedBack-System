import { Link } from "react-router-dom";

const AdminPage = () => {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-6rem)] w-max grid-cols-2 items-center justify-center gap-10 ">
      <Card icon="📄" title="Report Generation" link="/admin/reportgenerate" />
      <Card icon="🔐" title="Generate Login" link="/admin/generate" />
      <Card icon="🗃️" title="Update Data" link="" />
      <Card icon="🗑️" title="Delete Data" link="" />
    </section>
  );
};

export default AdminPage;

const Card = ({
  icon,
  title,
  link,
}: {
  icon: string;
  title: string;
  link: string;
}) => (
  <Link to={link}>
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg bg-black p-6 text-white transition-all hover:bg-black/70">
      <p className="text-4xl">{icon}</p>
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
  </Link>
);
