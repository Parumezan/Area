import DefaultWrapper from "@/components/DefaultWrapper";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/20/solid";

import type { BrickProps } from "@/types/type";
import Popup from "@/components/Popup";
import Container from "@/components/Container";
import Button from "@/components/Button";

export default function Dashboard() {
  const router = useRouter();
  const [bricks, setBricks] = useState<BrickProps[]>([]); // state to store the existing bricks
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [selectedBrick, setSelectedBrick] = useState<BrickProps>({
    id: 0,
    title: "",
    description: "",
    active: false,
    actions: [],
  });

  async function createBrick(brick: BrickProps) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACK_URL}/api/brick`,
      {
        method: "POST",
        body: JSON.stringify({
          title: brick.title,
          description: brick.description,
          published: false,
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
    } else {
      const json = await response.json();
      setBricks([...bricks, json]);
    }
  }

  function editBrick(brick: BrickProps) {
    fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/api/brick/${brick.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        title: brick.title,
        description: brick.description,
        published: brick.active,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.status === 401 || response.status === 403) {
          router.push("/login");
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

  function destroyBrick(brick: BrickProps) {
    fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/api/brick/${brick.id}`, {
      method: "DELETE",
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
        // remove the brick with the id of brick.id
        const idx = bricks.findIndex((b) => b.id === brick.id);
        setBricks([...bricks.slice(0, idx), ...bricks.slice(idx + 1)]);
      })
      .catch((err) => {
        console.log(err);
      });
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
    <DefaultWrapper>
      <div className="w-full h-full flex flex-row">
        <div className="w-full h-full flex flex-col justify-between">
          <div className="w-full h-full grid grid-cols-4 grid-flow-row-dense p-4 gap-4">
            {bricks.length &&
              bricks.map((brick: BrickProps, index: number) => (
                <Container key={index}>
                  <div className="flex flex-col justify-around space-y-5 w-full max-h-[150px] h-[150px]">
                    <div
                      className="flex flex-col w-full h-full cursor-pointer"
                      onClick={() => router.push(`/brick/${index}`)}
                    >
                      <h2 className="text-white truncate">{brick.title}</h2>
                      <p className="h-full text-white truncate">
                        {brick.description}
                      </p>
                    </div>
                    <div className="flex flex-row space-x-5">
                      <Button
                        onClick={() => {
                          editBrick({ ...brick, active: !brick.active });
                        }}
                      >
                        {brick.active ? "Active" : "Inactive"}
                      </Button>

                      <Button
                        onClick={() => {
                          setSelectedBrick(brick);
                          setShowEditPopup(true);
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </Container>
              ))}
          </div>

          <div className="w-full h-full p-4 flex flex-row justify-center">
            <div className="w-1/3">
              <Container>
                <div
                  className="w-full h-full rounded-lg p-2 cursor-pointer"
                  onClick={() => {
                    setSelectedBrick({
                      id: 0,
                      title: "",
                      description: "",
                      active: false,
                      actions: [],
                    });
                    setShowCreatePopup(true);
                  }}
                >
                  <PlusCircleIcon className="w-16 h-16 m-auto fill-white" />
                </div>
              </Container>
            </div>
          </div>
        </div>
        {showCreatePopup && (
          <Popup>
            <div className="flex flex-col space-y-8">
              <h2 className="text-white text-center">Create a brick</h2>
              <input
                placeholder="Name"
                type="text"
                className="bg-black text-white rounded-lg p-2"
                value={selectedBrick.title}
                onChange={(e) => {
                  setSelectedBrick({
                    ...selectedBrick,
                    title: e.target.value,
                  });
                }}
              />
              <input
                placeholder="Description"
                type="text"
                className="bg-black text-white rounded-lg p-2"
                value={selectedBrick.description}
                onChange={(e) =>
                  setSelectedBrick({
                    ...selectedBrick,
                    description: e.target.value,
                  })
                }
              />
              <div className="w-full flex flex-row justify-between">
                <Button onClick={() => setShowCreatePopup(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setShowCreatePopup(false);
                    createBrick(selectedBrick);
                  }}
                >
                  Create
                </Button>
              </div>
            </div>
          </Popup>
        )}
        {showEditPopup && (
          <Popup>
            <div className="flex flex-col space-y-8">
              <h2 className="text-white text-center">Edit a brick</h2>
              <input
                placeholder="Name"
                type="text"
                className="bg-black text-white rounded-lg p-2"
                value={selectedBrick.title}
                onChange={(e) =>
                  setSelectedBrick({
                    ...selectedBrick,
                    title: e.target.value,
                  })
                }
              />
              <input
                placeholder="Description"
                type="text"
                className="bg-black text-white rounded-lg p-2"
                value={selectedBrick.description}
                onChange={(e) =>
                  setSelectedBrick({
                    ...selectedBrick,
                    description: e.target.value,
                  })
                }
              />
              <div className="w-full flex flex-row justify-between">
                <Button onClick={() => setShowEditPopup(false)}>Cancel</Button>
                <Button
                  onClick={() => {
                    destroyBrick(selectedBrick);
                    setShowEditPopup(false);
                  }}
                >
                  Destroy
                </Button>
                <Button
                  onClick={() => {
                    setShowEditPopup(false);
                    editBrick(selectedBrick);
                  }}
                >
                  Validate
                </Button>
              </div>
            </div>
          </Popup>
        )}
      </div>
    </DefaultWrapper>
  );
}
