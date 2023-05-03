export default function runPromises(generator: any) {
  const it = generator();

  return (function _iterate(res) {

    !res.done && res.value
      .then((data: any) => _iterate(it.next(data)))
      .catch((data: any) => it.throw(data));

  })(it.next());
}