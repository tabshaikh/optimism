package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"

	"github.com/optimisticben/optimism/go/l2geth-exporter/bindings"
)

func main() {
	gethUrl := os.Getenv("GETH_URL")
	if gethUrl == "" {
		log.Fatal("GETH_URL environmental variable is required")
	}
	ovmCtcAddress := os.Getenv("OVM_CTC_ADDRESS")
	if ovmCtcAddress == "" {
		log.Fatal("OVM_CTC_ADDRESS environmental variable is required")
	}
	client, err := ethclient.Dial(gethUrl)
	if err != nil {
		log.Fatal(err)
	}

	address := common.HexToAddress(ovmCtcAddress)
	contract, err := bindings.NewOVMCanonicalTransactionChainCaller(address, client)
	if err != nil {
		log.Fatalf("Failed to bind contract at %s: %s", address.Hex(), err)
	}

	totalElements, err := contract.GetTotalElements(&bind.CallOpts{
		Context: context.Background(),
	})
	if err != nil {
		log.Fatalf("Failed to GetTotalElements on %s: %s", address.Hex(), err)
	}

	fmt.Printf("Total elements: %d", totalElements)
}
