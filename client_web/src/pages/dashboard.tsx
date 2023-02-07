import DefaultWrapper from "@/components/DefaultWrapper";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/20/solid";

import type { BrickProps } from "@/types/type";
import Popup from "@/components/Popup";

export default function Dashboard() {
  const router = useRouter();
  const [bricks, setBricks] = useState<BrickProps[]>([]); // state to store the existing bricks
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [selectedBrick, setSelectedBrick] = useState<BrickProps>();

  async function createBrick(brick: BrickProps) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACK_URL}/api/brick`,
      {
        method: "POST",
        body: JSON.stringify({
          title: brick.title,
          description: brick.description,
          active: false,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.status === 401 || response.status === 403) {
      router.push("/login");
      window.location.reload();
    }
  }

  async function editBrick(brick: BrickProps) {
    fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/api/brick/${brick.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        title: brick.title,
        description: brick.description,
        active: brick.active,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.status === 401 || response.status === 403) {
          router.push("/login");
          window.location.reload();
        }
      })
      .then(() => {
        // update the brick with the id of brick.id
        const idx = bricks.findIndex((b) => b.id === brick.id);
        setBricks([...bricks.slice(0, idx), brick, ...bricks.slice(idx + 1)]);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function accessBrick(id: number) {
    router.push("/brick/" + id);
  }

  async function fetchData() {
    await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/api/brick`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(async (response) => {
        if (response.status !== 404) {
          const json = await response.json();
          setBricks(json);
        }
      })
      .catch(() => {});
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="overflow-x-hidden">
      <DefaultWrapper>
        <div className="flex flex-row">
          <div className="w-full">
            <div className="flex flex-wrap">
              {bricks.length &&
                bricks.map((brick: BrickProps, id: number) => (
                  <div key={id} className="w-1/4 p-2">
                    <div className="bg-purple-500 rounded-lg p-2">
                      <h2
                        className="text-white cursor-pointer"
                        onClick={() => accessBrick(id)}
                      >
                        {brick.title}
                      </h2>
                      <p className="text-white">{brick.description}</p>
                      <button
                        className="bg-white text-black px-4 py-2 ml-auto mr-2 mt-auto mb-auto rounded-full"
                        onClick={() => {
                          setSelectedBrick({
                            ...brick,
                            active: !brick.active,
                          });
                          editBrick(selectedBrick);
                        }}
                      >
                        {selectedBrick.active ? "Active" : "Inactive"}
                      </button>
                      <button
                        className="bg-white text-black px-4 py-2 ml-auto mr-2 mt-auto mb-auto rounded-full"
                        onClick={() => {
                          setSelectedBrick(brick);
                          setShowEditPopup(true);
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              <div className="w-1/4 p-2">
                <div
                  className="bg-purple-500 rounded-lg p-2 cursor-pointer"
                  onClick={() => setShowCreatePopup(true)}
                >
                  <PlusCircleIcon className="w-auto h-auto m-auto fill-white" />
                </div>
              </div>
            </div>
          </div>
          {showCreatePopup && (
            <Popup>
              <h2 className="text-white text-center mb-4">Create Brick</h2>
              <div className="my-4">
                <label className="text-white">Name:</label>
                <input
                  type="text"
                  className="bg-purple-200 rounded-lg p-2"
                  onChange={(e) => {
                    setSelectedBrick({
                      ...selectedBrick,
                      title: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="my-4">
                <label className="text-white">Description:</label>
                <input
                  type="text"
                  className="bg-purple-200 rounded-lg p-2"
                  onChange={(e) =>
                    setSelectedBrick({
                      ...selectedBrick,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex justify-around">
                <button
                  className="bg-white text-black px-4 py-2 ml-auto mr-2 mt-auto mb-auto rounded-full"
                  onClick={() => setShowCreatePopup(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-white text-black px-4 py-2 ml-auto mr-2 mt-auto mb-auto rounded-full"
                  onClick={() => {
                    setShowCreatePopup(false);
                    createBrick(selectedBrick);
                  }}
                >
                  Create
                </button>
              </div>
            </Popup>
          )}
          {showEditPopup && (
            <Popup>
              <h2 className="text-white text-center mb-4">Edit Brick</h2>
              <div className="my-4">
                <label className="text-white">Name:</label>
                <input
                  type="text"
                  className="bg-purple-200 rounded-lg p-2"
                  value={selectedBrick.title}
                  onChange={(e) =>
                    setSelectedBrick({
                      ...selectedBrick,
                      title: e.target.value,
                    })
                  }
                />
              </div>
              <div className="my-4">
                <label className="text-white">Description:</label>
                <input
                  type="text"
                  className="bg-purple-200 rounded-lg p-2"
                  value={selectedBrick.description}
                  onChange={(e) =>
                    setSelectedBrick({
                      ...selectedBrick,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex justify-around">
                <button
                  className="bg-white text-black px-4 py-2 ml-auto mr-2 mt-auto mb-auto rounded-full"
                  onClick={() => setShowEditPopup(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-white text-black px-4 py-2 ml-auto mr-2 mt-auto mb-auto rounded-full"
                  onClick={() => setShowEditPopup(false)}
                >
                  Destroy
                </button>
                <button
                  className="bg-white text-black px-4 py-2 ml-auto mr-2 mt-auto mb-auto rounded-full"
                  onClick={() => {
                    setShowEditPopup(false);
                    editBrick(selectedBrick);
                  }}
                >
                  Validate
                </button>
              </div>
            </Popup>
          )}
        </div>
      </DefaultWrapper>
    </div>
  );
}
