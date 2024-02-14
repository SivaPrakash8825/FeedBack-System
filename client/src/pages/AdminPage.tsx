import { Link } from "react-router-dom";

const AdminPage = () => {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-6rem)] items-center justify-center gap-0 ">
      <div className="grid w-5/12 grid-cols-2 items-center justify-center gap-10">
        <Card
          icon="📄"
          title="Report Generation"
          link="/admin/reportgenerate"
        />
        <Card icon="🔐" title="Generate Login" link="/admin/generate" />
<<<<<<< HEAD
        <Card icon="🗃️" title="Update Data" link="/admin/update" />
        <Card icon="🗑️" title="Delete Data" link="" />
=======
        <Card icon="🗃️" title="Update Data" link="" />
        <Card icon="🗑️" title="Delete Data" link="/admin/delete" />
>>>>>>> b498384fef10ec5c33a99ab2886817c642322e6f
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
  icon: string;
  title: string;
  link: string;
}) => (
  <Link to={link}>
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg bg-black p-6 text-white transition-all hover:bg-black/70">
      <p className="text-4xl">{icon}</p>
      <h2 className="text-center text-xl font-semibold">{title}</h2>
    </div>
  </Link>
);
