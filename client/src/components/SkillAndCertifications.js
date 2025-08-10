import { motion } from "framer-motion";
import JsImg from '../../public/images/skillsImages/javascript-logo.png';
import ReactImg from "../../public/images/skillsImages/react-jsx-logo.png";
import NodejsImg from "../../public/images/skillsImages/nodejs-icon.png";
import MongoDBImg from "../../public/images/skillsImages/mongodb-icon.png";
import AwsImg from "../../public/images/skillsImages/aws-icon.png";
import AzureImg from "../../public/images/skillsImages/azureicon.png";

import AwsCert from "../../public/images/certificates/aws-certified-solutions-architect-associate.png";
import MsAzure from "../../public/images/certificates/microsoft-certified-azure-fundamentals.png";
import PwcHCD from "../../public/images/certificates/human-centered-design.png";
import PwcDA from "../../public/images/certificates/digital-acumen.png";
import { Layout } from "./Layout";
import Image from 'next/image';


const Card = ({ img, verifyLink }) => {
  return (
    <>
      <div className="flex flex-col items-center justify-between">
        <motion.div className='w-[200px] shadow-xl border m-2 p-3 flex flex-col items-center justify-center dark:shadow-lg dark:shadow-slate-50 dark:rounded-lg rounded-lg flex-shrink-0'
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.9 }}
          onTap={() => window.open(verifyLink, '_blank')}
        >
          <Image src={img} alt="skills icon" />
        </motion.div>
      </div>
    </>
  )
}

const SkillList = () => {
  return (
    <div className="flex">
      <Card img={JsImg} />
      <Card img={ReactImg} />
      <Card img={NodejsImg} />
      <Card img={MongoDBImg} />
      <Card img={AwsImg} />
      <Card img={AzureImg} />
    </div>
  );
};

const CertificationList = () => {
  return (

    <div className="flex">
      <Card
        verifyLink={'https://www.credly.com/badges/b3d8247d-2b8e-46f2-9adb-fd0ed9be79ed/'}
        img={AwsCert}
      />
      <Card
        verifyLink={'https://learn.microsoft.com/api/credentials/share/en-us/FeeconBehera-2966/5B8137F8C7E1D33?sharingId=7538A1A860DF4211'}
        img={MsAzure}
      />
      <Card
        verifyLink="https://www.credly.com/badges/7aba4c79-21ec-4ca8-9ea4-16683c6eeed8"
        img={PwcHCD}
      />
      <Card
        verifyLink="https://www.credly.com/badges/452985ae-2578-44ea-a7ef-d97afe11a10e"
        img={PwcDA}
      />
    </div>

  );
};

const SkillAndCertifications = () => {
  return (
    <>
      <Layout className="pt-16">

        <div className="flex flex-col items-center mt-40 justify-between">
          <h2 className='font-bold text-8xl w-full text-center md:text-6xl xs:text-4xl md:mb-16'>
            Certifications
          </h2>
          <div className='sm:overflow-x-auto flex space-x-4 p-4'>
            <div className="sm:w-[350px] sm:h-[250px] flex">
              <SkillList />
            </div>
          </div>
          <div className='sm:overflow-x-auto flex space-x-4 p-4'>
            <div className="sm:w-[350px] sm:h-[250px] flex">

              <CertificationList />
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default SkillAndCertifications;
