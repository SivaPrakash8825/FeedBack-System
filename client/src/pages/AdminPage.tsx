import { Link } from "react-router-dom";
import Icon1 from "/icon1.svg";
import Icon2 from "/icon2.svg";
import Icon3 from "/icon3.svg";
import Icon4 from "/icon4.svg";

const AdminPage = () => {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-6rem)] items-center justify-center gap-0 bg-hero-pattern bg-cover ">
      <div className="grid w-6/12 grid-cols-2 items-center justify-center gap-10">
        <Card
          icon={Icon1}
          title="Generate Report"
          link="/admin/reportgenerate"
        />
        <Card icon={Icon3} title="Generate Login" link="/admin/generate" />
        <Card icon={Icon4} title="Update Data" link="/admin/update" />
        <Card icon={Icon2} title="Delete Data" link="/admin/delete" />
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
  <Link to={link} className="group">
    <div className="flex items-center justify-around gap-3  rounded-2xl  bg-white/30 p-6 py-10 text-white shadow shadow-black drop-shadow-md transition-all hover:scale-105 hover:shadow-md hover:shadow-black hover:duration-150 active:scale-100 active:duration-150 ">
      <div className="rounded-full bg-white p-4">
        <img alt="image" src={icon} className="h-12 w-12" />
      </div>
      <h2 className="text-wrap text-center text-xl font-semibold">{title}</h2>
      <p className="h-10 w-10">
        <svg
          viewBox="0 0 65 41"
          className="h-full w-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M63.8511 20.1224L39.8511 1.1224C39.6868 0.970989 39.4765 0.87897 39.2538 0.861021C39.031 0.843072 38.8087 0.900227 38.6223 1.02337C38.4359 1.14651 38.296 1.32854 38.2251 1.54043C38.1542 1.75231 38.1563 1.98184 38.2311 2.1924L41.9311 14.0824L1.09106 19.9024C0.825848 19.9024 0.571494 20.0078 0.383958 20.1953C0.196421 20.3828 0.0910645 20.6372 0.0910645 20.9024C0.0910645 21.1676 0.196421 21.422 0.383958 21.6095C0.571494 21.797 0.825848 21.9024 1.09106 21.9024L41.9311 27.7224L38.2311 39.6124C38.1691 39.8173 38.1745 40.0367 38.2465 40.2383C38.3185 40.4399 38.4533 40.6131 38.6311 40.7324C38.8078 40.8516 39.0181 40.9111 39.2311 40.9024C39.4566 40.9011 39.6751 40.8236 39.8511 40.6824L63.8511 21.6824C63.9679 21.5887 64.0621 21.47 64.1269 21.335C64.1917 21.2 64.2253 21.0521 64.2253 20.9024C64.2253 20.7527 64.1917 20.6048 64.1269 20.4698C64.0621 20.3348 63.9679 20.2161 63.8511 20.1224ZM41.1311 37.1224L44.2311 27.1924C44.2723 27.0536 44.283 26.9075 44.2623 26.7642C44.2416 26.6209 44.19 26.4838 44.1111 26.3624C44.0335 26.2415 43.9309 26.1388 43.8101 26.0611C43.6893 25.9835 43.5532 25.9327 43.4111 25.9124L8.30106 20.9024L43.3711 15.9024C43.5132 15.882 43.6493 15.8313 43.7701 15.7537C43.8909 15.676 43.9935 15.5733 44.0711 15.4524C44.15 15.331 44.2016 15.1939 44.2223 15.0506C44.243 14.9073 44.2323 14.7612 44.1911 14.6224L41.1311 4.6824L61.6211 20.9024L41.1311 37.1224Z"
            fill="white"
          />
        </svg>
      </p>
    </div>
  </Link>
);
