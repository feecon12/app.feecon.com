import { Layout } from "@/components/Layout";
import React, { useState } from "react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const clearForm = () => {
    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  const  handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = fetch("http://localhost:3000/api/hello", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log(response);

      if (response.ok) {
        const responseData = await response.json();
        alert("Registration Done!");
        console.log(responseData);
        clearForm();
      } else {
        console.log("error inside response");
      }
    } catch (error) {
      console.log('error', error);
    }
  
  };
  return (
    <>
      <main>
        <Layout className="md:px-0 md:mx-0">
          <div className=" grid grid-cols-2 md:px-4">
            <div className=""></div>
            <div>
              <form onSubmit={handleSubmit}>
                <fieldset>
                  {/* name */}
                  <div>
                    <label>Name</label>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  {/* Email  */}
                  <div>
                    <label>Email</label>
                  </div>
                  <div>
                    <input
                      type="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  {/* Message  */}
                  <div>
                    <label>Message</label>
                  </div>
                  <div>
                    <textarea
                      rows={10}
                      cols={30}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>

                  <button type="submit">Submit</button>
                </fieldset>
              </form>
            </div>
          </div>
        </Layout>
      </main>
    </>
  );
};

export default ContactUs;
