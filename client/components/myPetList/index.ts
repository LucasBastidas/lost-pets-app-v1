import { state } from "../../state";
import Dropzone from "dropzone";
import { Router } from "@vaadin/router";
import { a, initMap, mapboxClient } from "../../mapbox.js";
export function initMyPetList() {
	class MyPetListCompEl extends HTMLElement {
		connectedCallback() {
			this.render();
		}
		addListeners() {
			state.getMyReportPets(() => {
				// console.log("obtuve mis mascotas");
			});

			const urlImage = [];

			const fotoInput = this.querySelector(".foto-input");

			//DROPZONE PARA SUBIR UNA IMAGEN
			const myDropzone = new Dropzone(fotoInput, {
				url: "/falsa",
				autoProcessQueue: false,
			});

			const dropzone = myDropzone.on("thumbnail", function (file) {
				const dataUrl = file.dataURL;
				// console.log(dataUrl);
				urlImage[0] = dataUrl;

				return dataUrl;
			});

			// MAPBOX
			const latAndLng = [];
			const map = this.querySelector("#map");
			map as any;

			const mapboxMap = initMap(map);
			async function searchLatAndLng(lugar) {
				if (lugar == "" || lugar == undefined) {
					latAndLng[0] = undefined;
					latAndLng[1] = undefined;
				} else {
					const search = await mapboxClient.geocodeForward(lugar, {
						// country: "ar",
						// autocomplete: true,
						language: "es",
					});
					const result = search.entity.features[0];
					const [lng, lat] = result.center;
					latAndLng[0] = lng;
					latAndLng[1] = lat;
					return [lng, lat];
				}
			}

			const formCont = this.querySelector(".form-cont");
			const form = this.querySelector(".form");
			const cancelFormButton = this.querySelector(".cancel");
			const list = this.querySelector(".list");
			const closeButton = this.querySelector(".cerrar");
			const formButton = this.querySelector(".save-changes-button");

			const mapboxButton = this.querySelector(".mapbox-button");
			const mapboxInput = this.querySelector("#mapbox-input");
			const petname = this.querySelector("#petName");
			const petdescription = this.querySelector("#petDescription");
			var mapBoxUbication = "";

			mapboxButton.addEventListener("click", () => {
				// console.log("holas");
				// console.log(mapboxInput);
				// console.log(mapboxInput.textContent);
				// console.log((mapboxInput as any).value);
				mapBoxUbication = (mapboxInput as any).value;
				mapboxClient.geocodeForward(
					(mapboxInput as any).value,
					{
						autocomplete: true,
						language: "es",
					},
					function (err, data, res) {
						// console.log(data.features[0].geometry.coordinates);
						mapboxMap.setCenter(data.features[0].geometry.coordinates);
						mapboxMap.setZoom(12);
						if (!err) data.features;
					}
				);
			});

			//BOTON CERRAR MODIFICACION
			closeButton.addEventListener("click", () => {
				(formCont as any).style.display = "none";
			});

			//BOTON CANCELAR MODIFICACION
			cancelFormButton.addEventListener("click", () => {
				(formCont as any).style.display = "none";
			});

			//BOTON ELIMINAR PUBLICACION
			list.addEventListener("delete", (e) => {
				const petId = (e as any).detail.petId;
				state.deletePet(petId, () => {
					// console.log("se elimino la publicacion");
					state.data.myPets = [];
					state.setCompleteTaskMessage(1, () => {
						state.getMyReportPets(() => {
							Router.go("/task-completed");
						});
					});
				});
			});

			//BOTON DE MASCOTA ENCONTRADA
			list.addEventListener("found", (e) => {
				// console.log((e as any).detail);
				const petId = (e as any).detail.petId;
				const userId = (e as any).detail.userId;
				// console.log("found");

				state.changeStateOfReportToFounded(petId, () => {
					// console.log("fue marcado como encontrado");
					state.data.myPets = [];
					state.setCompleteTaskMessage(2, () => {
						state.getMyReportPets(() => {
							Router.go("/task-completed");
						});
					});
				});
			});

			//BOTON DE MODIFICAR MASCOTA O PUBLICACION
			list.addEventListener("update", (e) => {
				// console.log((e as any).detail);
				const petId = (e as any).detail.petId;
				const userId = (e as any).detail.userId;
				const petName = (e as any).detail.petName;
				const petDescription = (e as any).detail.petDescrption;
				const petImage = (e as any).detail.petImage;
				const petUbication = (e as any).detail.petUbication;

				(
					fotoInput as any
				).style.background = `#fff url(${petImage}) center center/cover no-repeat`;
				// console.log(petname);//

				(petname as any).placeholder = petName;

				(petdescription as any).placeholder = petDescription;
				(mapboxInput as any).placeholder = petUbication;

				state.setPetIdToUpdate(petId, () => {
					// console.log("Metí el id");
					(formCont as any).style.display = "flex";
				});
			});
			form.addEventListener("submit", async (e) => {
				e.preventDefault();
				const target = e.target;
				var lngAndLat = await searchLatAndLng((target as any).qmap.value);
				var newPetName = (target as any).petName.value;
				var newPetDescription = (target as any).petDescription.value;
				var newPetUrlImage = urlImage[0];
				var lng = latAndLng[0];
				var lat = latAndLng[1];
				var newPetUbication = (target as any).qmap.value;
				if (newPetName === "") {
					newPetName = undefined;
				}
				if (newPetDescription === "") {
					newPetDescription = undefined;
				}
				if (newPetUrlImage === "") {
					newPetUrlImage = undefined;
				}
				if (newPetUbication === "") {
					newPetUbication = undefined;
				}

				state.setPetDataToUpdate(
					newPetName,
					newPetDescription,
					newPetUrlImage,
					lat,
					lng,
					newPetUbication,
					() => {
						console.log(state.data.myPetUpdateData);
						// console.log("voy a modificar");
						state.updateDataOfMyReportedPet(() => {
							// console.log("modifique mi mascota");
							state.setCompleteTaskMessage(3, () => {
								Router.go("/task-completed");
								// (formCont as any).style.display = "none";
							});
						});
					}
				);
			});
		}
		render() {
			const style = document.createElement("style");
			style.innerHTML = `
         .list{
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 40px;
         }
			.form-cont{
				display: none;
				flex-direction: column;
				position: fixed;
				overflow-y: scroll;
				max-height: 100%;
				align-items: center;
				margin-left: 20px;
				margin-right: 20px;
				background-color: #6f95b3;
				border: solid;
				border-color: #3774a5;
				border-radius: 4%;
				top: 0%;
				gap: 0px;
				left: 0;
				right: 0;
				text-align: center;
				animation: myAnim 1s ease 0s 1 normal forwards;
			}
			@media(min-height:805px){
				.form-cont{
					overflow-y: unset;
					max-height: unset;
				}
			}
         .form{
            width:300px;
         }
         .input{
            width: 250px;
            height: 25px;
         }
         .text-area{
            width: 250px;
            height: 100px;
         }
		 .save-changes-button{
			width: 250px;
			margin-top: 30px;
			border: none;
			height: 30px;
			border-radius: 25px;
			background-color: aquamarine;
			cursor: pointer;
		 }

         .upload-image-cont{
            display: flex;
            flex-direction: column;
            align-items: center;
         }
         .foto-input{
            width: 170px;
            height: 140px;
            background-color: rgba(171, 163, 153, 0.606);
         }
         img{
            width: 170px;
            height: 140px;
         }
         .dz-details{
            display:none;
         }
         .dz-progress{
            display:none;
         }
         .dz-error-message{
            display:none;
         }
         .dz-success-mark{
            display:none;
         }
         .dz-progress{
            display:none;
         }
         .dz-error-mark{
            display:none;
         }
			.map-cont{
				display: flex;
				justify-content: center;
			}
			.map{
				height: 140px;
				width: 200px;
				margin-top: 5px;
				margin-bottom: 5px;
			}
			.mapbox-form{
				display:flex;
				margin-bottom: 16px;
				gap: 5px;
			}
			.mapbox-button{
				appearance: auto;
				writing-mode: horizontal-tb !important;
				display: flex;
				height: 25px;
				align-items: center;
				border: solid 2px;
				border-radius: 5px;
				text-align: center;        
				cursor: pointer;
				background-color: buttonface;
				margin: 0em;
				padding: 1px 6px;
				border-width: 2px;
				border-style: outset;
				border-color: buttonborder;
				border-image: initial;     
			}
			.cerrar{
            position: fixed;
            right: 24px;
            cursor:pointer;
         }
		 .cancel{
			cursor:pointer;
		 }
      `;
			const pets = state.data.myPets;
			this.innerHTML = `
         <div class="list">
         
            ${pets
							.map(
								(pet) =>
									`<x-my-pet-card title="${pet.name}" imageUrl= "${
										pet.imageUrl
									}" description="${
										pet.description || "Sin descripción"
									}" petId="${pet.id || "1"}"  userId="${pet.user_id}" lost= ${
										pet.lost
									} ubication="${pet.ubication}" ></x-my-pet-card>`
							)
							.join("")}
      </div>
		<div class="form-cont">
		<div class="cerrar"> X </div>
      <form class="form">

      <label>
         <p>Nombre</p>
         <input class="input" name="petName" type="text" id="petName">
      </label>
         <div class="upload-image-cont">
      <p class="image-text">Arrastrá tu imagen o apreta acá ⬇⬇</p>
      <div style=background-color:gray" class="foto-input"></div>
         </div>

      <label>
      <p>Description</p>
      <textarea class="text-area" name="petDescription" id="petDescription"></textarea>
      </label>

		<label>
               <p>UBICACIÓN (Punto de referencia)</p>

					<div class="mapbox-form">
               <input class="input" name="qmap" type="text" id="mapbox-input">
               <p class="mapbox-button">🌎</p>
               </div>
					
					<div class="map-cont">
               <div id="map" class="map"></div>
					</div>
               </label>

      <div>
      <button class="save-changes-button">Guardar cambios</button>
      </div>

	  
	  </form>
      <p class="cancel">Cancelar</p>
		</div>
      `;
			this.appendChild(style);
			this.addListeners();
		}
	}
	customElements.define("x-my-pet-cards-list", MyPetListCompEl);
}
