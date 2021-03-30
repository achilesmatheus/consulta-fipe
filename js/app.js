const selectVehicleType = document.querySelector('select[name="vehicle_type"]');
const selectVehicleBrand = document.querySelector('select[name="vehicle_brand"]');
const selectVehicleModel = document.querySelector('select[name="vehicle_model"]');
const selectVehicleYear = document.querySelector('select[name="vehicle_year"]');
const divResult = document.querySelector('div.result')

const makeURL = (informationType, { ...vehicle }) => {
  const { type, info, id, year, brandId } = vehicle
  const baseURL = "http://fipeapi.appspot.com/api/1/" + type;
  const suffix = "json"

  const URL = {
    brands: `${baseURL}/${info}.${suffix}`,
    modelByBrand: `${baseURL}/${info}/${brandId}.${suffix}`,
    modelAndYear: `${baseURL}/${info}/${brandId}/${id}.${suffix}`,
    price: `${baseURL}/${info}/${brandId}/${id}/${year}.${suffix}`
  }[informationType]

  return URL
}

const getVehicleData = async url => {
  const response = await fetch(url)
  const responseAsJSON = await response.json()

  return responseAsJSON
}

const populateSelect = (selectElement, dataJSON) => {
  const dataAsString = dataJSON.reduce((acc, { id, name }) => {
    return acc + `<option value="${id}">${name}</option>`
  }, '')

  selectElement.innerHTML = dataAsString
}

selectVehicleType.addEventListener('click', event => {
  const url = makeURL('brands', {
    type: event.target.value,
    info: 'marcas',
  })

  getVehicleData(url)
    .then(dataJSON => populateSelect(selectVehicleBrand, dataJSON))
})

selectVehicleBrand.addEventListener('click', event => {
  const url = makeURL('modelByBrand', {
    type: selectVehicleType.value,
    info: 'veiculos',
    brandId: event.target.value
  })

  getVehicleData(url)
    .then(dataJSON => populateSelect(selectVehicleModel, dataJSON))
})

selectVehicleModel.addEventListener('click', event => {
  const url = makeURL('modelAndYear', {
    type: selectVehicleType.value,
    info: 'veiculo',
    brandId: selectVehicleBrand.value,
    id: event.target.value
  })

  getVehicleData(url)
    .then(dataJSON => populateSelect(selectVehicleYear, dataJSON))
})

selectVehicleYear.addEventListener('click', event => {
  const url = makeURL('price', {
    type: selectVehicleType.value,
    info: 'veiculo',
    brandId: selectVehicleBrand.value,
    id: selectVehicleModel.value,
    year: event.target.value
  })
  console.log(url);
  getVehicleData(url)
    .then(({ marca, name, preco }) => {
      divResult.textContent = `${marca} ${name} - ${preco}`
    })
})