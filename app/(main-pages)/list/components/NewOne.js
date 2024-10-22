"use client";
import React, { useState, useEffect } from "react";
import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { createClient } from "@/utils/supabase/client";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import IonIcon from "@reacticons/ionicons";
import { Pagination } from "@nextui-org/react";
import Link from "next/link";
import { Chip } from "@nextui-org/react";

function NewOne() {
  const [data, setData] = useState([]);
  const [selectedPlatform,setSelectedPlatform]=useState("SKEncar")

  const items = Array.from({ length: 6 }, (_, index) => `Item ${index + 1}`);

  const getData = async () => {
    const supabase = createClient();
    let query = supabase
      .from("cardata")
      .select("*")
      .order("created_at", { ascending: false })
      .eq('like', false)  // Add this line to filter for like = false
      .limit(10);

    const { data, error } = await query;

    if (error) {
      console.log(error);
    } else if (data) {
      setData(data);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="mt-10">
      <div className="page-heading">
        <h1 className="page-title test"> New </h1>

        <nav className="nav__underline">
          <ul
            className="group"
            uk-switcher="connect: #group-tabs ; animation: uk-animation-slide-right-medium, uk-animation-slide-left-medium"
          >
            <li>
              
              <a onClick={()=>{
                setSelectedPlatform("SKEncar")
              }}>
                
                 SK Encar
                 </a>
            </li>
            <li>
              
            <a onClick={()=>{
                setSelectedPlatform("Other")
              }}>
                 Other car</a>
            </li>
          </ul>
        </nav>
      </div>
      <div
        className="relative"
        tabIndex="-1"
        uk-slider="autoplay: true;infinite: false;autoplayInterval:2000"
      >
        <div className="uk-slider-container pb-1">
          <ul
            className="uk-slider-items w-[calc(100%+14px)]"
            uk-scrollspy="target: > li; cls: uk-animation-scale-up; delay: 20;repeat:true"
          >
            {data.map((item, index) => (
              <li
                key={index}
                className="pr-3 md:w-1/4 w-1/2"
                uk-scrollspy-className="uk-animation-fade"
              >
                <div className="card">
                  <div className="absolute top-2 right-2 z-10">
                    <Chip size="sm" color={selectedPlatform === "SKEncar" ? "danger" : "success"}>{selectedPlatform}</Chip>
                  </div>

                  <Link href={`/list/${item.id}`}>
                    <div className="card-media sm:aspect-[2/1.7] h-36">
                      <img src={item?.uploadedImageUrls[0]?.url} alt="" />
                      <div className="card-overly"></div>
                    </div>
                  </Link>
                  <div className="card-body flex justify-between">
                    <div className="flex-1">
                      <p className="card-text text-black font-medium line-clamp-2">
                        {item.title}
                      </p>
                      <div className="text-xs line-clamp-1 mt-1 text-right">
                        Mileage:{parseInt(item.mileage)}km{" "}
                      </div>
                      <div className="text-xs line-clamp-1 mt-1 text-right">
                        Year:{parseInt(item.year)}{" "}
                      </div>
                      <div className="text-xs line-clamp-1 mt-1 text-right">
                        Accident:{item.accidentSelf}{" "}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="max-md:hidden">
          <a
            className="nav-prev !bottom-1/2 !top-auto"
            href="#"
            uk-slider-item="previous"
          >
            {" "}
            <IonIcon name="chevron-back" className="text-2xl"></IonIcon>{" "}
          </a>
          <a
            className="nav-next !bottom-1/2 !top-auto"
            href="#"
            uk-slider-item="next"
          >
            {" "}
            <IonIcon name="chevron-forward" className="text-2xl"></IonIcon>
          </a>
        </div>

        <div className="flex justify-center">
          <ul className="inline-flex flex-wrap justify-center my-5 gap-2 uk-dotnav uk-slider-nav">
            {" "}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NewOne;
