import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useFirestore } from 'vuefire';

export const useSalesStore = defineStore('sales', () => {
    const date = ref('');
    const db = useFirestore();
    const salesCollection = ref([]);

    const fetchSales = async () => {
        if (date.value) {
            console.log('Date selected:', date.value);
            console.log(typeof(date.value));
            const q = query(
                collection(db, 'sales'),
                where('date', '==', date.value)
            );
            console.log('Query created:', q);
            const querySnapshot = await getDocs(q);
            salesCollection.value = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            console.log('Sales data:', salesCollection.value);
        } else {
            console.log('No date selected');
            salesCollection.value = [];
        }
    };

    const isDateSelected = computed(() => date.value);
    const noSales = computed(() => !salesCollection.value.length && date.value);

    const totalSalesOfDay = computed(() => {
        return salesCollection.value.reduce((total, sale) => total + sale.total, 0);
    });

    return {
        date,
        salesCollection,
        isDateSelected,
        noSales,
        totalSalesOfDay,
        fetchSales
    };
});
