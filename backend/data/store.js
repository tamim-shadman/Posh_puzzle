const {
  seedUsers,
  seedShops,
  seedProducts,
  seedOrders,
  seedEvents,
  seedCoupons,
} = require('./seeds');

// Deep clone helper
const clone = (data) => JSON.parse(JSON.stringify(data));

class InMemoryCollection {
  constructor(initialData = [], name = 'item') {
    this.name = name;
    this.data = clone(initialData);
  }

  async find(filter = {}) {
    let result = this.data.filter((item) => {
      for (const [key, val] of Object.entries(filter)) {
        if (val === undefined) continue;
        if (key === '$or' && Array.isArray(val)) {
          const matchAny = val.some((subFilter) => {
            return Object.entries(subFilter).every(([k, v]) => {
              if (v instanceof RegExp) return v.test(item[k]);
              return item[k] === v;
            });
          });
          if (!matchAny) return false;
        } else if (val instanceof RegExp) {
          if (!val.test(item[key])) return false;
        } else if (typeof val === 'object' && val !== null) {
          if (val.$gte !== undefined && item[key] < val.$gte) return false;
          if (val.$lte !== undefined && item[key] > val.$lte) return false;
          if (val.$in !== undefined && !val.$in.includes(item[key])) return false;
        } else {
          if (item[key] !== val) return false;
        }
      }
      return true;
    });
    return clone(result);
  }

  async findOne(filter = {}) {
    const list = await this.find(filter);
    return list.length > 0 ? clone(list[0]) : null;
  }

  async findById(id) {
    const item = this.data.find((i) => i._id === id || i.id === id);
    return item ? clone(item) : null;
  }

  async create(doc) {
    const newDoc = {
      _id: doc._id || `${this.name.slice(0, 4)}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      ...doc,
      createdAt: doc.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.data.unshift(clone(newDoc));
    return clone(newDoc);
  }

  async findByIdAndUpdate(id, updates, options = { new: true }) {
    const index = this.data.findIndex((i) => i._id === id || i.id === id);
    if (index === -1) return null;
    
    // Support $set operator or flat object
    const updatePayload = updates.$set ? updates.$set : updates;
    this.data[index] = {
      ...this.data[index],
      ...updatePayload,
      updatedAt: new Date(),
    };
    return clone(this.data[index]);
  }

  async findByIdAndDelete(id) {
    const index = this.data.findIndex((i) => i._id === id || i.id === id);
    if (index === -1) return null;
    const removed = this.data.splice(index, 1);
    return clone(removed[0]);
  }

  async countDocuments(filter = {}) {
    const items = await this.find(filter);
    return items.length;
  }

  reset() {
    this.data = [];
  }
}

const store = {
  users: new InMemoryCollection(seedUsers, 'user'),
  shops: new InMemoryCollection(seedShops, 'shop'),
  products: new InMemoryCollection(seedProducts, 'product'),
  orders: new InMemoryCollection(seedOrders, 'order'),
  events: new InMemoryCollection(seedEvents, 'event'),
  coupons: new InMemoryCollection(seedCoupons, 'coupon'),
  resetAll: () => {
    store.users = new InMemoryCollection(seedUsers, 'user');
    store.shops = new InMemoryCollection(seedShops, 'shop');
    store.products = new InMemoryCollection(seedProducts, 'product');
    store.orders = new InMemoryCollection(seedOrders, 'order');
    store.events = new InMemoryCollection(seedEvents, 'event');
    store.coupons = new InMemoryCollection(seedCoupons, 'coupon');
  },
};

module.exports = store;
