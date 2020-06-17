import React, { useState } from "react";
import { axiosWithAuth } from "../utils/axiosWithAuth";
import useInput from './useInput';


const initialColor = {
  color: "",
  code: { hex: "" }
};

const ColorList = ({ colors, props, updateColors, getData }) => {
  console.log(colors, ' colors');
  console.log(updateColors, ' updateColors')
  const [editing, setEditing] = useState(false);
  const [colorToEdit, setColorToEdit] = useState(initialColor);
  const [colorToCreate,setColorToCreate,handleColorToCreate] = useInput('')
  const [hexCode,setHexCode,handleHexCode] = useInput('')

  const handleSubmit = e => {
  e.preventDefault();

  const data = {
    color: colorToCreate,
    code: {hex: hexCode}
  }

  axiosWithAuth().post("/api/colors", data)
  .then(res => {
    console.log(res)
    updateColors(res.data)
  })
  .catch(err => console.log(err))

}



  const editColor = color => {
    setEditing(true);
    setColorToEdit(color);
  };

  const body = {...colorToEdit}
  const id = colorToEdit.id

  const saveEdit = e => {
    e.preventDefault()
    axiosWithAuth()
    .put(`/api/colors/${id}`, body)
    .then(res => {
      console.log(res)
      updateColors(colors.map(item => item.id === id ? colorToEdit:item))
      // props.history.push(res.data)
    })
    .catch(err => console.log(err, "mistakes have been made"))
  };

  const deleteColor = color => {
    // make a delete request to delete this color
    axiosWithAuth()
    .delete(`/api/colors/${color.id}`, color)
    .then(res => console.log("response from .delete", res))
    document.location.reload(true)
    .catch(err => console.log(err, "more mistakes"))
  };

  return (
    <div className="colors-wrap">
      <p>colors</p>
      <ul>
        {colors.map(color => (
          <li key={color.color} onClick={() => editColor(color)}>
            <span>
              <span className="delete" onClick={e => {
                    e.stopPropagation();
                    deleteColor(color)
                  }
                }>
                  x
              </span>{" "}
              {color.color}
            </span>
            <div
              className="color-box"
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value }
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setEditing(false)}>cancel</button>
            </div>
        </form>
        <div>
        <form onSubmit={handleSubmit}>
            <legend>add color</legend>
            <label>color name</label>
            <input type='text' name='color name' value={colorToCreate} onChange={e => handleColorToCreate(e.target.value)}></input>
            <label>hex code</label>
            <input type='text' name='hex code' value={hexCode} onChange={e => handleHexCode(e.target.value)}></input>
            <button type='submit'>add</button>
      </form>
      </div>

    </div>
  );
};

export default ColorList;



