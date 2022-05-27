import {getHotSearchList} from '../app'

export default async function handler(request, response) {
  const list = await getHotSearchList();
  response.status(200).send(list);
}
