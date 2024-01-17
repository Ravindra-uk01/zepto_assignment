import React, { useEffect, useState } from "react";
import axios from "axios";
import "./searchBar.css";
import _ from "lodash";

const SearchBar = () => {
  const [users, setUsers] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleChange = (e) => {
    setSearchItem(e.target.value);
    debouncedData(searchItem);
  };

  const getAllUsers = async (searchItem) => {
    try {
      if (searchItem.trim() === "") {
        setUsers([]);
        return;
      }
      const response = await axios.get(`https://dummyjson.com/users`);
      const filteredUsers = response.data.users.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchItem.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchItem.toLowerCase())
      );
      setUsers(filteredUsers);
    } catch (err) {
      console.log(err);
    }
  };

  const debouncedData = _.debounce(getAllUsers, 300);

  const handleSelectedUser = (user) => {
    const isSelected = selectedUsers.some((obj) => obj.id === user.id);
    if (!isSelected) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleRemove = (user) => {
    const updatedUsers = selectedUsers.filter((obj) => obj.id !== user.id);
    setSelectedUsers(updatedUsers);
  };

  return (
    <div className="userSearchContainer">
      <h1 className="">Pick Users</h1>
      <div className="userSearchCont">
        <ul className="selectedUserContainer">
          {selectedUsers &&
            selectedUsers.length > 0 &&
            selectedUsers.map((user) => (
              <li className="selectedUserDiv" key={user.id}>
                <div className="selectedUserImg">
                  <img src={user.image} alt="user image" />
                </div>
                <p>
                  {user.firstName} {user.lastName}
                </p>
                <span onClick={() => handleRemove(user)}>X</span>
              </li>
            ))}
        </ul>
        <input
          type="search"
          value={searchItem}
          onChange={handleChange}
          placeholder="Add new user..."
        />
        <div className="userContainer">
          <ul>
            { searchItem && users &&
              users.length > 0 &&
              users.map((user) => (
                <li
                  key={user.id}
                  className="userDetails"
                  onClick={() => handleSelectedUser(user)}
                >
                  <div className="userImage">
                    <img src={user.image} alt="user image" />
                  </div>
                  <p>
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p>{user.email}</p>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
